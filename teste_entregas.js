// Teste para o sistema de entregas
// Para executar: node teste_entregas.js

// Importar as funções (simulando require)
// Como estamos em um ambiente de teste simples, vamos copiar as funções aqui

const TAXA_ENTREGA_JAU = 10.00;

function cepParaNumero(cep) {
    return parseInt(cep.replace(/\D/g, ''), 10);
}

function validarCEPJau(cep) {
    const cepNumero = cepParaNumero(cep);
    return cepNumero >= 17200001 && cepNumero <= 17229999;
}

function calcularTaxaEntrega(cep) {
    const cepNumero = cepParaNumero(cep);
    if (isNaN(cepNumero) || cep.replace(/\D/g, '').length !== 8) {
        return {
            erro: "CEP inválido. Digite um CEP com 8 dígitos.",
            taxa: null
        };
    }

    if (!validarCEPJau(cep)) {
        return {
            erro: "CEP não atendido. Realizamos entregas apenas em Jaú/SP.",
            taxa: null
        };
    }

    return {
        taxa: TAXA_ENTREGA_JAU,
        mensagem: "Taxa de entrega para Jaú/SP"
    };
}

// Testes
console.log("=== TESTES DO SISTEMA DE ENTREGAS ===\n");

// Teste 1: CEP válido de Jaú (Centro)
console.log("Teste 1 - CEP do Centro de Jaú:");
console.log("CEP: 17201-000");
console.log("Resultado:", calcularTaxaEntrega("17201-000"));
console.log();

// Teste 2: CEP válido de Jaú (outro bairro)
console.log("Teste 2 - CEP de outro bairro de Jaú:");
console.log("CEP: 17210-000");
console.log("Resultado:", calcularTaxaEntrega("17210-000"));
console.log();

// Teste 3: CEP válido de Jaú (limite superior)
console.log("Teste 3 - CEP no limite de Jaú:");
console.log("CEP: 17229-999");
console.log("Resultado:", calcularTaxaEntrega("17229-999"));
console.log();

// Teste 4: CEP inválido (fora de Jaú)
console.log("Teste 4 - CEP fora de Jaú:");
console.log("CEP: 01310-100 (São Paulo)");
console.log("Resultado:", calcularTaxaEntrega("01310-100"));
console.log();

// Teste 5: CEP malformado
console.log("Teste 5 - CEP malformado:");
console.log("CEP: 1720100");
console.log("Resultado:", calcularTaxaEntrega("1720100"));
console.log();

// Teste 6: CEP com formatação diferente
console.log("Teste 6 - CEP sem formatação:");
console.log("CEP: 17201000");
console.log("Resultado:", calcularTaxaEntrega("17201000"));
console.log();

console.log("=== FIM DOS TESTES ===");
