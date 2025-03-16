import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreatePlanDto } from './dto/plan/create-plan.dto';
import { Plan, PlanDocument } from './schemas/plan.schema';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPlan(plan: CreatePlanDto) {
    try {
      // Create a product in Stripe
      const product = await this.stripe.products.create({
        name: plan.name,
        description: plan.desc,
      });
      const interval = 'month';

      // Create a price for the product
      const price = await this.stripe.prices.create({
        unit_amount: plan.price * 100, // Convert dollars to cents
        currency: 'usd', // Currency (e.g., USD)
        recurring: { interval }, // Billing interval (e.g., monthly or yearly)
        product: product.id, // Link price to the product
      });

      return await this.planModel.create({
        ...plan,
        interval,
        stripeProductId: product.id,
        stripePriceId: price.id,
      });
    } catch (error) {
      throw new Error(`Failed to create subscription plan: ${error.message}`);
    }
  }

  async getPlans() {
    try {
      return await this.planModel.find({ isActive: true });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
