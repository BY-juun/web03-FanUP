import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICRO_SERVICES } from '../constants/microservices';
import { CoreModule } from '../core/core.module';
import { FanUPGateway } from './fanup/fanup.gateway';
import { FanUPService } from './fanup/fanup.service';

@Module({
  imports: [
    CoreModule,
    ClientsModule.register([
      {
        name: MICRO_SERVICES.CORE.NAME,
        transport: Transport.TCP,
        options: {
          host: MICRO_SERVICES.CORE.HOST,
          port: MICRO_SERVICES.CORE.PORT,
        },
      },
      {
        name: MICRO_SERVICES.AUTH.NAME,
        transport: Transport.TCP,
        options: {
          host: MICRO_SERVICES.AUTH.HOST,
          port: MICRO_SERVICES.AUTH.PORT,
        },
      },
    ]),
  ],
  providers: [FanUPGateway, FanUPService],
  exports: [FanUPService],
})
export class SocketModule {}