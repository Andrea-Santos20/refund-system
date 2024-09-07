// Seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

// Seleciona os elementos da lista.
const expenseList = document.querySelector('ul');
const expensesTotal = document.querySelector('aside header h2');
const expensesQuantity = document.querySelector('aside header p span');

//Aprender como criar um evento para capturar a entrada de conteúdo no input.
//Captura o evento de input para formatar o valor.
amount.oninput = () => {
    //Expressão Regex para remover letras ao digitar no input.
    let value = amount.value.replace(/\D/g, '');

    //Transformar o valor em centavos.
    value = Number(value) / 100;

    //Atualiza o valor do input
        amount.value = formatCurrencyBRL(value);        
}

//Função para formatar o valor da moeda (padrão real brasileiro)
function formatCurrencyBRL(value) {
    //Usar o método toLocaleString
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    //retorna o valor formatado.
    return value;
}

//Evento de submit para manipular as informações digitadas pelo usuário.
form.onsubmit = (event) => {
    //Previnindo o comportanto de recarregar a página.
    event.preventDefault();

    //Criando objeto com detalhes para uma nova despesa.
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }
    //Chama a função que adiciona o item na lista.
    expenseAdd(newExpense);
}

//Método adiciona um novo item na lista.
function expenseAdd(newExpense) {
    try {
       //Criando o elemento li para adicionar o item na lista.
       const expenseItem = document.createElement('li');
       expenseItem.classList.add('expense');

       //Criar o ícone (img) da categoria.
       const expenseIcon = document.createElement('img');
       expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
       expenseIcon.setAttribute('alt', newExpense.category_name);

       //Criar a informação da despesa.
       const expenseInfo = document.createElement('div');
       expenseInfo.classList.add('expense-info');

       //Cria o nome da despesa.
       const expenseName = document.createElement('strong');
       expenseName.textContent = newExpense.expense // Para atualizar o conteúdo.

       //Cria a categoria da despesa.
       const expenseCategory = document.createElement('span');
       expenseCategory.textContent = newExpense.category_name;

       //Adicionando expenseName e Category na despesa.
       expenseInfo.append(expenseName, expenseCategory);

       //Criando valor da despesa.
       const expenseAmount = document.createElement('span');
       expenseAmount.classList.add('expense-amount');
       expenseAmount.innerHTML = `<small    >R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`;
        // Criar o ícone de remover.
        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', "img/remove.svg");
        removeIcon.setAttribute('alt', "remover");
       // Para adicionar as informações no item.
       expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

       //Adiocnamos o item na lista(li).
       expenseList.append(expenseItem);

       //Limpar formulario para adicionar novo item.
       formClear()

       //Atualizando os totais.
       updateTotals();

    }catch(error) {
        alert("Não foi possivel atualizar a lista de despesas.")
        console.log(error)
    }
}

// Atualizando os totais.
function updateTotals() {
    try {
        // Recuperando todos os itens (li) da lista (ul).
        const items = expenseList.children;
        
        //Atualiza a quantidade de itens da lista.
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

        //Para o total, criar variável para incrementar o total.
        let total = 0

        //Percorre cada item (li) da lista (ul).
        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector('.expense-amount');

            // Removendo caracteres não numéricos e substituindo a vírgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".");

            // Converte o valor para float.
            value = parseFloat(value);

            //Verifica se é um númeto válido
            if (isNaN(value)) {
                return alert (
                    "Não foi possivel calcular o total. O valor não parece ser um número."
                )
            }
            // Incrementar o valor total.
            total += Number(value)
        }

        //Criar a span para adicionar o R$ formarado.
        const symbolBRL = document.createElement('small');
        symbolBRL.textContent = "R$";

        // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado(CSS).
        total = formatCurrencyBRL(total).toUpperCase().replace("R$","");

        // Limpa o conteúdo do elemento.
        expensesTotal.innerHTML = "";

        // Adiciona o símbolo da moeda e o valor total.
        expensesTotal.append(symbolBRL, total);
    } catch (error) {
        console.log(error);
        alert("Não foi possível atualizar os totais.")
    }

}

// Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
    // Verifica se o elemento clicado é o ícone de remover.
    if (event.target.classList.contains("remove-icon")) {
        //Obtém a li pai do elemento clicado.
        const item = event.target.closest(".expense");
        //Remove item da lista
        item.remove();
    }
    // Para atualizar o total
    updateTotals();

});

function formClear() {
    expense.value = '';
    category.value = '';
    amount.value = '';

    //Coloca o foco no input de amount.
    expense.focus()
}