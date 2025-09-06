// entregas.js - Taxas de entrega por bairro para Jaú/SP
const taxasEntrega = {
    "CENTRO": 5.00,
    "VILA PINHEIRO": 6.00,
    "JARDIM PAULISTA": 7.00,
    "JARDIM PEDRO OMETTO": 7.50,
    "JARDIM SAO JORGE": 8.00,
    "JARDIM JOAO XXIII": 8.00,
    "JARDIM JORGE ATALLA": 8.50,
    "JARDIM AEROPORTO": 9.00,
    "JARDIM FLORIDA": 9.00,
    "JARDIM PANORAMA": 9.50,
    "DISTRITO INDUSTRIAL": 10.00,
    "JARDIM SANTA LUZIA": 10.00,
    "JARDIM NOVA JAÚ": 10.50,
    "PARQUE INDUSTRIAL": 11.00,
    "JARDIM BELA VISTA": 11.00,
    "OUTROS": 15.00 // Taxa para bairros não listados
};

// Mapeamento de faixas de CEP para bairros
const cepParaBairro = [
    { inicio: 17200000, fim: 17200999, bairro: "CENTRO" },
    { inicio: 17201000, fim: 17201999, bairro: "VILA PINHEIRO" },
    { inicio: 17202000, fim: 17202999, bairro: "JARDIM PAULISTA" },
    { inicio: 17203000, fim: 17203999, bairro: "JARDIM PEDRO OMETTO" },
    { inicio: 17204140, fim: 17204740, bairro: "JARDIM SAO JORGE" }, // Faixa específica
    { inicio: 17204000, fim: 17204999, bairro: "JARDIM SAO JORGE" }, // Restante do intervalo
    { inicio: 17205000, fim: 17205999, bairro: "JARDIM JOAO XXIII" },
    { inicio: 17206000, fim: 17206999, bairro: "JARDIM JORGE ATALLA" },
    { inicio: 17207000, fim: 17207999, bairro: "JARDIM AEROPORTO" },
    { inicio: 17208000, fim: 17208999, bairro: "JARDIM FLORIDA" },
    { inicio: 17209000, fim: 17209999, bairro: "JARDIM PANORAMA" },
    { inicio: 17210000, fim: 17210999, bairro: "DISTRITO INDUSTRIAL" },
    { inicio: 17211000, fim: 17211999, bairro: "JARDIM SANTA LUZIA" },
    { inicio: 17212000, fim: 17212999, bairro: "JARDIM NOVA JAÚ" },
    { inicio: 17213000, fim: 17213999, bairro: "PARQUE INDUSTRIAL" },
    { inicio: 17214000, fim: 17214999, bairro: "JARDIM BELA VISTA" }
];

// Função para converter CEP para número
function cepParaNumero(cep) {
    return parseInt(cep.replace(/\D/g, ''), 10);
}

// Função para encontrar o bairro pelo CEP
function encontrarBairroPorCEP(cep) {
    const cepNumero = cepParaNumero(cep);
    
    if (isNaN(cepNumero)) return "OUTROS";
    
    // Procura a faixa de CEP que contém o número
    const faixa = cepParaBairro.find(intervalo => 
        cepNumero >= intervalo.inicio && cepNumero <= intervalo.fim
    );
    
    return faixa ? faixa.bairro : "OUTROS";
}

// Função para calcular a taxa de entrega
function calcularTaxaEntrega(cep) {
    const bairro = encontrarBairroPorCEP(cep);
    return {
        bairro: bairro,
        taxa: taxasEntrega[bairro] || taxasEntrega["OUTROS"]
    };
}

// Função para validar se o CEP é de Jaú
function validarCEPJau(cep) {
    const cepNumero = cepParaNumero(cep);
    return cepNumero >= 17200000 && cepNumero <= 17214999;
}