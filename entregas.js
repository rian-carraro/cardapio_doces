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

// Mapeamento de CEPs para bairros (faixas de CEP de Jaú)
const cepParaBairro = {
    "17200": "CENTRO",
    "17201": "VILA PINHEIRO", 
    "17202": "JARDIM PAULISTA",
    "17203": "JARDIM PEDRO OMETTO",
    "17204": "JARDIM SAO JORGE",
    "17205": "JARDIM JOAO XXIII",
    "17206": "JARDIM JORGE ATALLA",
    "17207": "JARDIM AEROPORTO",
    "17208": "JARDIM FLORIDA",
    "17209": "JARDIM PANORAMA",
    "17210": "DISTRITO INDUSTRIAL",
    "17211": "JARDIM SANTA LUZIA",
    "17212": "JARDIM NOVA JAÚ",
    "17213": "PARQUE INDUSTRIAL",
    "17214": "JARDIM BELA VISTA"
};

// Função para encontrar o bairro pelo CEP
function encontrarBairroPorCEP(cep) {
    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    
    // Pega os primeiros 5 dígitos do CEP
    const prefixoCEP = cep.substring(0, 5);
    
    return cepParaBairro[prefixoCEP] || "OUTROS";
}

// Função para calcular a taxa de entrega
function calcularTaxaEntrega(cep) {
    const bairro = encontrarBairroPorCEP(cep);
    return {
        bairro: bairro,
        taxa: taxasEntrega[bairro] || taxasEntrega["OUTROS"]
    };
}