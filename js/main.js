class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){

        for(let i in this){

            if((this[i] === '' || this[i] === undefined || this[i] === null) && i != 'descricao'){
                return false
            }
            //console.log(i + " " + this[i])
        }

        if((Number.isNaN(this.dia) || Number.isNaN(this.valor)) || this.dia <= 0){
            return false
        }

        //Cálculo dos dias do mês
        switch(this.mes){
            case '04':
            case '06':
            case '09':
            case '11':
                if(this.dia > 30){
                    return false
                }
                break
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '10':
            case '12':
                if(this.dia > 31){
                    return false
                }
                break
            default:
                //Cálculo do ano bissexto e validando
                if(this.ano % 4 === 0 && this.mes == '02'){
                    if(this.dia > 29){
                        return false
                    }  
                } else if(this.dia > 28){
                    return false
                }  
        }

        let ano_atual = new Date().getFullYear()
        if(parseInt(this.ano) <= ano_atual && parseInt(this.ano) >= 1970){
            return true
        } else {
            return false
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
        let id = this.controlaId()
        localStorage.setItem(id, JSON.stringify(despesa))
        localStorage.setItem("id", id)
    }
}

let db = new Db()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')    

    let despesa = new Despesa(ano.value, mes.value, parseInt(dia.value), tipo.value, descricao.value, parseInt(valor.value))

    if(despesa.validarDados()){
        modalSucesso()
        db.armazenarDespesa(despesa)
    } else {
        modalErro()
    }

}

function modalSucesso(){
    document.getElementById("corModal").className = "modal-header text-success"
    document.getElementById("modal-title").innerHTML = "Sucesso"
    document.getElementById("mensagemModal").innerHTML = "Sua despesa foi cadastrada!"
    document.getElementById("closeModal").className = "btn btn-success"
    $('#modalRegistraDespesa').modal('show')
}

function modalErro(){
    document.getElementById("corModal").className = "modal-header text-danger"
    document.getElementById("modal-title").innerHTML = "Algo deu errado"
    document.getElementById("mensagemModal").innerHTML = "Um dos campos recebeu um valor inválido, por favor, altere os valores."
    document.getElementById("closeModal").className = "btn btn-danger"
    $('#modalRegistraDespesa').modal('show')
}
