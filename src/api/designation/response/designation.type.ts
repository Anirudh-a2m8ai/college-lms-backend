import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DesignationResponse {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  thumbnailUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
