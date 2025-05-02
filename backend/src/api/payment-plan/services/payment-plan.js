'use strict';

/**
 * payment-plan service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::payment-plan.payment-plan');
