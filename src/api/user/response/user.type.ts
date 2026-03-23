import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  status: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
