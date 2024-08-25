import { INominationResponse } from '../../nominations/interfaces/INominationResponse';

export interface ISubNominationResponse extends INominationResponse {
  nominationId: number;
}
