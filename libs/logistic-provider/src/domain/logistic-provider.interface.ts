import { LogisticProviderEnum } from './logistic-provider.enum';

export interface ILogisticProvider {
  readonly name: LogisticProviderEnum;
  getShipments(): Promise<any[]>;
  getShipment(shipmentId: string): Promise<any>;
}
