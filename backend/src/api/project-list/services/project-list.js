'use strict';

/**
 * project-list service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::project-list.project-list');
