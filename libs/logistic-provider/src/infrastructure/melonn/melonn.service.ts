import { LogisticProviderEnum } from '@app/logistic-provider/domain/logistic-provider.enum';
import { ILogisticProvider } from '../../domain/logistic-provider.interface';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from '@app/shared';
import { Config, CONFIG } from '@app/config';

@Injectable()
export class MelonnService implements ILogisticProvider {
  public readonly name = LogisticProviderEnum.MELONN;
  private readonly logger = new Logger(MelonnService.name);
  private readonly baseUrl = this.config.logisticProvider.melonn.baseUrl;
  private readonly apiKey = this.config.logisticProvider.melonn.apiKey;

  constructor(
    private readonly httpClient: HttpClientService,
    @Inject(CONFIG) private readonly config: Config,
  ) {}

  async getShipments(): Promise<any[]> {
    this.logger.log(`Getting shipments from ${this.baseUrl}`);
    const response = await this.httpClient.get({
      url: `${this.baseUrl}/sell-orders`,
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
    return response.body.map((shipment: any) => this.mapShipment(shipment));
  }

  async getShipment(externalOrderId: string): Promise<any> {
    this.logger.log(`Getting shipment ${externalOrderId} from ${this.baseUrl}`);
    const idMapped = encodeURIComponent(externalOrderId);
    const url = `${this.baseUrl}/sell-orders/${idMapped}`;
    const response = await this.httpClient.get({
      url,
      headers: {
        'X-Api-Key': this.apiKey,
      },
    });
    return this.mapShipment(response.body);
  }

  private mapShipment(shipment: any): any {
    return {
      trackingUrl: shipment.trackingUrl,
      externalOrderId: shipment.externalOrderNumber,
      providerOrderId: shipment.internalOrderNumber,
      orderCreatedAt: new Date(shipment.creationDate),
      clientName: shipment.buyer?.fullName,
      clientPhone: shipment.buyer?.phoneNumber,
      clientEmail: shipment.buyer?.email,
      trackingEvents: [
        {
          eventName: this.mapStatus(shipment.sellOrderState?.name),
          eventNameFromProvider: shipment.sellOrderState?.name,
          date: new Date(),
        },
      ],
      status: this.mapStatus(shipment.sellOrderState?.name),
    };
  }

  private mapStatus(status: string): string {
    const TrackingStatusMap = {
      ORDER_RECEIVED: 'Received - valid',
      ITEMS_RESERVED: 'All items reserved - ready for fulfillment',
      PICKING_ITEMS: 'Picking',
      ITEMS_PICKED: 'Picked',
      PACKING_ITEMS: 'Packing',
      ITEMS_PACKED: 'Packed',
      ORDER_SHIPPED: 'Shipped - in transit',
      ORDER_PICKED_UP: 'Picked-up by buyer',
      ORDER_DELIVERED: 'Delivered to buyer',
      ORDER_CANCELLED: 'Canceled',
    };

    for (const [key, value] of Object.entries(TrackingStatusMap)) {
      if (value === status) {
        return key as string;
      }
    }
    return 'OTHER';
  }
}
