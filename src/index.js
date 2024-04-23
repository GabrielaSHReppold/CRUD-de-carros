import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

let listaDeVeiculos = []
let proximoId = 1

app.post('/veiculos',(request,response)=>{
   const modelo = request.body.modelo
   const marca = request.body.marca
   const ano = Number(request.body.ano)
   const cor = request.body.cor
   const preco = Number(request.body.preco)

    if(!modelo){
        response.status(400).send('Passe um modelo de veículo válido')
    }

    if(!marca){
        response.status(400).send('Passe uma marca de veículo válido')
    }

    if(!ano){
        response.status(400).send('Passe o ano do veículo válido')
    }

    if(!cor){
        response.status(400).send('Passe uma cor válida para o veículo')
    }

    if(!preco){
        response.status(400).send('Passe um preço de veículo válido')
    }
     
    if (modelo && marca && ano && cor && preco ) {
        let novoVeiculo ={
            id:proximoId,
            modelo:modelo,
            marca:marca,
            ano:ano,
            cor:cor,
            preco:preco
        }
    
        listaDeVeiculos.push(novoVeiculo)
        proximoId++
    
        response.status(201).send(`
        ID: ${novoVeiculo.id} | Modelo ${novoVeiculo.modelo} | Marca: ${novoVeiculo.marca} | Ano: ${novoVeiculo.ano} | Cor: ${novoVeiculo.cor} | Preço: R$ ${novoVeiculo.preco}`) 
        }else{
            response.status(400).send('Erro! Revise suas informações.')
        }})    

app.get('/veiculos',(request,response)=>{
    if(listaDeVeiculos.length === 0){
        response.status(404).send('Não existe veículo cadastrado.') 
    }    

    const veiculosCadastrados = listaDeVeiculos.map((veiculo) => `ID: ${veiculo.id} | Modelo: ${veiculo.modelo} | Marca: ${veiculo.marca} | Ano: ${veiculo.ano} | Cor: ${veiculo.cor} | Preço: R$ ${veiculo.preco}`)

    response.status(200).send(veiculosCadastrados)
})

app.get('/veiculosBuscar', (request, response) => {
    const marcaFiltrada = request.query.marca
    const verificarMarca = listaDeVeiculos.find(marca => marca.marca === marcaFiltrada)


    if (verificarMarca) {
        response.status(200).send(listaDeVeiculos)
    } else {
        response.status(404).send('Não há veículos cadastrados desta marca.') 
    }

})





















app.listen(3333, ()=> console.log("Servidor rodando na porta 3333"))