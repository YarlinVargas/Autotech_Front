export interface CreateUpdateUser {
  idUser: number;
  idIdentificationType?: number;
  identificationNumber: string;
  name: string;
  lastName: string;
  email: string;
  telephoneNumber: string;
  idCompany?: number;
  contracts: Partial<ContractWithFilter>[];
}

export interface ContractWithFilter {
  idContract: number;
  contractCode: number;
  contractName: string;
  waitingResult: number;
  partialResult: number;
  finishedResult: number;
}