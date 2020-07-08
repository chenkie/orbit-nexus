import { objectType } from '@nexus/schema';

export const Sale = objectType({
  name: 'Sale',
  definition(t) {
    t.string('date');
    t.int('amount');
  }
});

export const DashboardData = objectType({
  name: 'DashboardData',
  definition(t) {
    t.int('salesVolume');
    t.int('newCustomers');
    t.int('refunds');
    t.list.field('graphData', { type: 'Sale' });
  }
});
