import { Veiculo } from "./veiculo.model";

export interface Cliente {
  idcliente?: number;
  nome: string;
  telefone: string;
  celular: string;
  cpfcnpj: string;
  endereco: string;
  bairro: string;
  cidade: string;
  veiculos?: Veiculo[];
}