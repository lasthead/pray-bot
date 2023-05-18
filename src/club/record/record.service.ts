import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Repository} from "sequelize-typescript";
import {RecordModel} from "./record.model";

@Injectable()
export class RecordService {
  constructor(@InjectModel(RecordModel) private userRepository: Repository<RecordModel>) {}
}
