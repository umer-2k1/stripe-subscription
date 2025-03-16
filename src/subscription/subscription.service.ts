import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { CreatePlanDto } from './dto/plan/create-plan.dto';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  Subscription,
  SubscriptionDocument,
} from './schemas/subscription.schema';
import { CreateSubscriptionDto } from './dto/subscription';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    });
  }

  // ! TODO: handle proper error handling
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

  async createSubscription(
    user: UserDocument,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    try {
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await this.stripe.customers.create({
          name: user.name,
          email: user.email,
        });

        // Save Stripe Customer ID to the user model
        await this.userModel.findByIdAndUpdate(
          user._id,
          {
            stripeCustomerId: customer.id,
          },
          { new: true },
        );
        stripeCustomerId = customer.id;
      }

      const plan = await this.planModel.findOne({
        isActive: true,
        _id: createSubscriptionDto.planId,
      });
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }

      const session = await this.stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        customer_update: { address: 'auto' },
        line_items: [
          {
            price: plan?.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        cancel_url: `${process.env.FRONTEND_URL}/dashboard/subscriptions`,
        success_url: `${process.env.FRONTEND_URL}/dashboard/subscriptions?checkout=success`,
      });

      return {
        message: 'Stripe Checkout session created successfully',
        checkoutUrl: session.url,
        sessionId: session.id,
      };

      // !TODO: now subcription detail will be handled by webhook
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateSubscription() {
    try {
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async cancelSubscription() {
    try {
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserSubscription() {
    try {
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list();
      return customers.data;
    } catch (error) {
      throw new Error('Unable to fetch customers from Stripe');
    }
  }
}
