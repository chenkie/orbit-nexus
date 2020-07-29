import { schema } from 'nexus';
import dashboardData from '../data/dashboardData';

schema.objectType({
  name: 'Sale',
  definition(t) {
    t.string('date');
    t.int('amount');
  }
});

schema.objectType({
  name: 'DashboardData',
  definition(t) {
    t.int('salesVolume');
    t.int('newCustomers');
    t.int('refunds');
    t.list.field('graphData', { type: 'Sale' });
  }
});

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('dashboardData', {
      type: 'DashboardData',
      resolve() {
        return dashboardData;
      }
    });
  }
});
