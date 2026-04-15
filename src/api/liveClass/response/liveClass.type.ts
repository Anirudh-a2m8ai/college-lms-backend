import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LiveClassResponseDto {
	@Expose()
	id: string;

	@Expose()
	startTime: string;

	@Expose()
	endTime: string;

	@Expose()
	classRoomId: string;

	@Expose()
	hostId: string;

	@Expose()
	status: string;

	@Expose()
	createdAt: string;

	@Expose()
	updatedAt: string;
}