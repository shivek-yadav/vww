/** Central model registry with automatic fallback switching */
import { isFallbackActive } from '../config/database.js';
import { getFallbackModel } from '../config/fallbackStore.js';

import { User as MongooseUser } from './User.model.js';
import { Category as MongooseCategory } from './Category.model.js';
import { MenuItem as MongooseMenuItem } from './MenuItem.model.js';
import { Order as MongooseOrder } from './Order.model.js';
import { Booking as MongooseBooking } from './Booking.model.js';
import { GalleryImage as MongooseGalleryImage } from './GalleryImage.model.js';
import { FAQ as MongooseFAQ } from './FAQ.model.js';
import { Testimonial as MongooseTestimonial } from './Testimonial.model.js';
import { Inquiry as MongooseInquiry } from './Inquiry.model.js';
import { PageContent as MongoosePageContent } from './PageContent.model.js';
import { SiteSettings as MongooseSiteSettings } from './SiteSettings.model.js';
import { ActivityLog as MongooseActivityLog } from './ActivityLog.model.js';
import { Coupon as MongooseCoupon } from './Coupon.model.js';

function createProxy(name, mongooseModel) {
  return new Proxy(mongooseModel, {
    get(target, prop, receiver) {
      if (isFallbackActive()) {
        const fallback = getFallbackModel(name);
        if (prop in fallback) {
          const val = fallback[prop];
          return typeof val === 'function' ? val.bind(fallback) : val;
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

export const User = createProxy('User', MongooseUser);
export const Category = createProxy('Category', MongooseCategory);
export const MenuItem = createProxy('MenuItem', MongooseMenuItem);
export const Order = createProxy('Order', MongooseOrder);
export const Booking = createProxy('Booking', MongooseBooking);
export const GalleryImage = createProxy('GalleryImage', MongooseGalleryImage);
export const FAQ = createProxy('FAQ', MongooseFAQ);
export const Testimonial = createProxy('Testimonial', MongooseTestimonial);
export const Inquiry = createProxy('Inquiry', MongooseInquiry);
export const PageContent = createProxy('PageContent', MongoosePageContent);
export const SiteSettings = createProxy('SiteSettings', MongooseSiteSettings);
export const ActivityLog = createProxy('ActivityLog', MongooseActivityLog);
export const Coupon = createProxy('Coupon', MongooseCoupon);
