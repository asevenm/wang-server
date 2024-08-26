import { DataSource } from 'typeorm';

export const InstrumentProviders = [
  {
    provide: 'INSTRUMENT_REPOSITORY',
    useFactory: async (dataSource: DataSource) =>
      dataSource.getRepository('Instrument'),
    inject: ['MYSQL_DATA_SOURCE'],
  },
];
