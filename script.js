/*Importações*/
const promptSync = require("prompt-sync");
const mysql = require("mysql2/promise");
const { createPool } = require("mysql2");

const prompt = promptSync({ sigint: true });

/*Conexão com o MySQL*/
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Etec",
    database: "gerenciador_de_tarefas",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

/*Funções*/
async function adicionarTarefas() {
    try {
        const nome = prompt("Digite uma nova tarefa: ")
        const dificuldade = prompt("Digite a dificuldade da tarefa: ")

        const sql = "INSERT INTO tarefas (resposta, dificuldade) VALUES (?, ?)"
        await db.query(sql, [nome, dificuldade])
        console.log("\nTarefa adicionada com sucesso!\n")
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível adicionar a tarefa!\n")
    }
}

async function listarTarefas() {
    try {
        const sql = "SELECT * FROM tarefas"
        const [resultado] = await db.query(sql)

        if (resultado.length === 0) {
            console.log("Nenhuma tarefa adicionada!\n")
            return resultado;
        }

        resultado.forEach(tarefa => {
            console.log(`ID ${tarefa.id}: ${tarefa.resposta}  ||  Dificuldade: ${tarefa.dificuldade}`)
        })
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível listar as tarefas!\n")
    }
}

async function deletarTarefas() {
    try {
        const tarefas = await listarTarefas()
        if (tarefas.length === 0) return;


        const deletar = parseInt(prompt("Digite o ID da tarefa em que você deseja deletar: "))
        const sql = "DELETE FROM tarefas WHEN id = ?"
        const [resultado] = await db.query(sql, [deletar])

        if(resultado.affectedRows === 0) {
            console.log("\n[ERRO] Nenhuma task identificada!\n")
        } else {
            console.log("\NTarefa excluída!\n")
        }
    } catch (erro) {
        console.log("\n[ERRO] Não foi possível deletar uma tarefa!\n")
    }
}

/*Função principal*/
async function main() {
    let cont = -1;
    do {
        /*Opções*/
        console.log("----------------------------------")
        console.log("      Gerenciador de Tarefas      ")
        console.log("----------------------------------")
        console.log("1 - Adicionar tarefa")
        console.log("2 - Deletar tarefa")
        console.log("3 - Listar tarefas")
        console.log("0 - Sair")
        cont = parseInt(prompt("Escolha uma opção: "))
        
        /*Executa as opção selecionada*/
        switch (cont) {
            case 1:
                await adicionarTarefas();
                break;
            case 2:
                await deletarTarefa();
                break;
            case 3:
                await listarTarefas();
                break;
            case 0:
                console.log("Saindo...");
                process.exit(0);
            default:
                console.log("[ERRO] Opção inválida!\n")
        }

    } while (cont !== 0)
}

main()
