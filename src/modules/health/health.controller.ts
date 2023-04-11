import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Public } from '../../common/decorators/public';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: MongooseHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @Public()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () =>
        this.http.pingCheck(
          'Master4 app',
          `http://${this.configService.get<string>(
            'host',
          )}:${this.configService.get<number>('port')}/api/ping`,
        ),
      () => this.db.pingCheck('MongoDB', { timeout: 1500 }),
      () =>
        this.disk.checkStorage('Storage', { path: '/', thresholdPercent: 0.5 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
