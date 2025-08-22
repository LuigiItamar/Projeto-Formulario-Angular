export interface ObjetoItem {
nome: string;
quantidade: number;
nSerie: string;
}


export interface Usuario {
  id?: number | string;
  nome: string;
  nomeMeio?: string;
  sobrenome: string;
  email: string;
  cep: string;
  cpf: string;
  objetos: {
    tipoProduto: string;
    quantidade: number;
    nSerie: string[];
  }[];
  selecionado?: boolean;
}