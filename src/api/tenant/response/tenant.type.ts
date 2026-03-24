import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TenantResponse {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  subdomain: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  logo: string;

  @Expose()
  website: string;

  @Expose()
  defaultLanguage: string;

  @Expose()
  timezone: string;

  @Expose()
  status: string;

  @Expose()
  totalUsers: number;

  @Expose()
  coursesCreated: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
