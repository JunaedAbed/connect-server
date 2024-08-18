import { RegOrgDTO } from './reg-org.dto';

export class RegisterDTO {
  strEmployeeName: string;
  strEmail: string;
  strPassword: string;
  strJobRole: string;
  RegOrg: RegOrgDTO;
}
