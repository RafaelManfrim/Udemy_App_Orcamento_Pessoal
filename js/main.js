class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
        this.erro = 'Esperando um erro'
    }

    validarDados(tipo){

        if(tipo != 'filtro'){
            this.verificaValorVazio()
        }

        //Verificações correspondentes ao dia e aos valores numéricos no registro
        if(tipo != 'filtro'){
            if((Number.isNaN(this.dia) || Number.isNaN(this.valor)) || this.dia <= 0){
                this.erro = 'Um campo está com um valor inválido, por favor verifique todos os campos e corrija o problema.'
                return false
            }
        } else {
            if(parseInt(this.dia) <= 0 && this.dia != ''){
                this.erro = 'O dia não pode ser menor ou igual a 0, por favor corrija o problema.'
                return false
            }
        }


        switch(this.mes){
            case '02':
                //Cálculo do ano bissexto e validando
                if(this.ano % 4 === 0 && this.mes == '02'){
                    if(this.dia > 29){
                        this.erro = 'O ano inserido é bissexto, porém fevereiro não pode ter mais de 29 dias. Por favor faça as alterações necessárias.'
                        return false
                    }  
                } else if(this.dia > 28){
                    this.erro = 'Fevereiro possui somente 28 dias. Por favor, faça a alteração nos valores'
                    return false
                }
                break

            case '04':
            case '06':
            case '09':
            case '11':
                if(this.dia > 30){
                    this.erro = 'O mês inserido possui somente 30 dias, por favor altere o valor.'
                    return false
                }
                break
            default:
                if(this.dia > 31){
                    this.erro = 'Você não pode inserir mais que 31 dias. Por favor, faça a alteração necessária'
                    return false
                }
                break
        }

        let ano_atual = new Date().getFullYear()
        if(this.ano != ''){
            if(parseInt(this.ano) <= ano_atual && parseInt(this.ano) >= 1970){
                return true
            } else {
                this.erro = 'O ano inserido precisa estar entre 1970 e o ano atual, por favor faça a alteração necessária.'
                return false
            }
        }
        return true
    }

    verificaValorVazio(){
        for(let i in this){

            if((this[i] === '' || this[i] === undefined || this[i] === null) && i != 'descricao'){
                this.erro = 'Um campo está em branco, por favor verifique todos os campos e insira o valor necessário.'
                return false
            }

        }
    }

}

class Db{
    constructor(){
        if(localStorage.getItem("id") === null){
            localStorage.setItem("id", 0)
        }
    }

    controlaId(){
        let proximoId = localStorage.getItem("id")
        return parseInt(proximoId) + 1
    }

    armazenarDespesa(despesa){

        //Faz todos os dias terem 2 dígitos
        if(despesa.dia < 10){
            despesa.dia = '0' + despesa.dia 
        }

        //Se descriçao estiver vazia adiciona 'Sem descrição' como valor
        if(despesa.descricao === ''){
            despesa.descricao = 'Sem descrição'
        }

        let id = this.controlaId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem("id", id)
    }

    recuperaDespesa(){
        let id = localStorage.getItem('id')
        let despesas = Array()

        for(let i = 1; i <= id; i++){
            let despesa_recuperada = JSON.parse(localStorage.getItem(i))
            if(despesa_recuperada !== null){
                despesas.push(despesa_recuperada)
            }
        }
        return despesas
    }

    filtraDespesa(despesa){

        if(!(despesa.validarDados('filtro'))){
            modalErroFiltro(despesa.erro)
            return false
        }

        let despesas_filtradas = Array()

        despesas_filtradas = this.recuperaDespesa()

        //Colocando os filtros
        if(despesa.ano != ''){
            despesas_filtradas = despesas_filtradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
            despesas_filtradas =  despesas_filtradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
            despesas_filtradas =  despesas_filtradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
            despesas_filtradas =  despesas_filtradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.valor != ''){
            despesas_filtradas =  despesas_filtradas.filter(d => d.valor == despesa.valor)
        }

        return despesas_filtradas
    }

}

let db = new Db()

//Função executada para cadastrar a despesa
function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')    

    let despesa = new Despesa(ano.value, mes.value, parseInt(dia.value), tipo.value, descricao.value, parseFloat(valor.value))

    if(despesa.validarDados()){
        modalSucesso()
        db.armazenarDespesa(despesa)
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        modalErro(despesa.erro)
    }

}

//Funções para feedback visual
function modalSucesso(){
    document.getElementById("corModal").className = "modal-header text-success"
    document.getElementById("modal-title").innerHTML = "Sucesso"
    document.getElementById("mensagemModal").innerHTML = "Sua despesa foi cadastrada!"
    document.getElementById("closeModal").className = "btn btn-success"
    $('#modalRegistraDespesa').modal('show')
}

function modalErro(erro){
    document.getElementById("corModal").className = "modal-header text-danger"
    document.getElementById("modal-title").innerHTML = "Algo deu errado"
    document.getElementById("mensagemModal").innerHTML = erro
    document.getElementById("closeModal").className = "btn btn-danger"
    $('#modalRegistraDespesa').modal('show')
}

function modalErroFiltro(erro){
    document.getElementById("corModal").className = "modal-header text-danger"
    document.getElementById("modal-title").innerHTML = "Algo deu errado no filtro"
    document.getElementById("mensagemModal").innerHTML = erro
    document.getElementById("closeModal").className = "btn btn-danger"
    $('#modalErroFiltro').modal('show')
}

//Recuperação dos registros

function recuperaRegistros(){
    let despesas = Array()
    despesas = db.recuperaDespesa()

    let listaDespesas = document.getElementById('listaDespesas')

    despesas.forEach(function(d){

        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        linha.insertCell(4)

    })
}

//Exibição do botão de filtros
let filtrosAparecendo = 0
function exibirFiltros(){
    
    if(filtrosAparecendo === 0){
        document.getElementById("filtros").className = "row mt-3"
        filtrosAparecendo = 1
    } else {
        document.getElementById("filtros").className = "d-none"
        filtrosAparecendo = 0
    }   
    
}

//Função para receber o filtro da despesa
function pesquisarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, '', valor.value)

    let despesas_pos_filtro = db.filtraDespesa(despesa)

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas_pos_filtro.forEach(function(d){

        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        linha.insertCell(4)

    })
}

function limparFiltros(){
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    recuperaRegistros()
    ano.value = ''
    mes.value = ''
    dia.value = ''
    tipo.value = ''
    valor.value = ''
}