let cart = []; // carrinho
let modalQt = 1; // quantidade
let modalKey = 0 // qual bolo
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//Listagem dos bolos
cakeJson.map((item, index)=>{
    let cakeItem = c('.models .cake-item').cloneNode(true); // seleciona e cria as estruturas de disco das bolos na página

    cakeItem.setAttribute('data-key', index); // linca o id ao key
    cakeItem.querySelector('.cake-item--img img').src = item.img; // adiciona a foto do bolos
    cakeItem.querySelector('.cake-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // adiciona o preço do bolos
    cakeItem.querySelector('.cake-item--name').innerHTML = item.name; // adiciona o nome da bolos
    cakeItem.querySelector('.cake-item--desc').innerHTML = item.description; // adiciona a descrição da bolos
    cakeItem.querySelector('a').addEventListener('click', (e)=>{ // criar evento de click

        e.preventDefault(); // bloqueia a atualização da pagina quando clicado
        let key = e.target.closest('.cake-item').getAttribute('data-key'); // identifica a bolos clicada pelo id
        modalQt = 1; //resetando a quantidade sempre que abrir o modal para 1 unidade
        modalKey = key;

        //preencher as informações no modal quando houver o click
        c('.cakeBig img').src = cakeJson[key].img; // imagem
        c('.cakeInfo h1').innerHTML = cakeJson[key].name; // nome
        c('.cakeInfo--desc').innerHTML = cakeJson[key].description; //descrição
        c('.cakeInfo--actualPrice').innerHTML = `R$ ${cakeJson[key].price.toFixed(2)}`; // preço com fixado 2 depois da virgula

        /**** resetando o tamanho do bolo no Modal  *****/
            c('.cakeInfo--size.selected').classList.remove('selected'); //desselecionar o tamanho da bolos
            cs('.cakeInfo--size').forEach((size, sizeIndex)=>{ // selecionar o tamanho da bolos
                if(sizeIndex == 2) {
                size.classList.add('selected'); // seleciona a grande
            }
        /**** *****/          
            size.querySelector('span').innerHTML = cakeJson[key].sizes[sizeIndex];// acessa o tamanho da bolos
        });

        c('.cakeInfo--qt').innerHTML = modalQt;
       

        c('.cakeWindowArea').style.opacity = '0';
        c('.cakeWindowArea').style.display = 'flex'; // quando clicar na bolos aparecera um modal
        setTimeout(()=>{ 
            c('.cakeWindowArea').style.opacity = '1';
        }, 200); //espera 200 milisegundas para aparecer 
    }); 
    

    c('.cake-area').append( cakeItem );
});

//eventos do modal

// evento de fechar o modal
    function closeModal() {
        c('.cakeWindowArea').style.opacity = '0';// ficar invisível
        setTimeout(()=>{
            c('.cakeWindowArea').style.display = 'none'; // fechar o modal
        }, 500); // em 0,5 segundos
    }
    cs('.cakeInfo--cancelButton, .cakeInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal);
    });

// evento de alterar a quantidade
    c('.cakeInfo--qtmenos').addEventListener('click', ()=>{
        if(modalQt > 1){ // só subtrai se o qt for maior que 1
            modalQt--;
            c('.cakeInfo--qt').innerHTML = modalQt;
        }
    });

    c('.cakeInfo--qtmais').addEventListener('click', ()=>{
        modalQt++;
        c('.cakeInfo--qt').innerHTML = modalQt;
    });

// evento de seleção de tamanho
    cs('.cakeInfo--size').forEach((size, sizeIndex)=>{ // selecionar o tamanho da bolos  
       size.addEventListener('click', (e)=>{
        c('.cakeInfo--size.selected').classList.remove('selected'); //desselecionar o tamanho da bolos
        size.classList.add('selected'); // seleciona
       })
    });

// ação do botão de carrinho
    c('.cakeInfo--addButton').addEventListener('click', ()=>{ // carrinho acessa o bolokey e localiza a bolos
        let size = parseInt(c('.cakeInfo--size.selected').getAttribute('data-key')); // string em inteiro
        
        // adicionando ao carrinho

            // a mesma bolo do mesmo tamanho deve estar juntas
            let identifier = cakeJson[modalKey].id+'@'+size; //identificador = id + size
            let key = cart.findIndex((item)=>item.identifier == identifier); // verifica se já tem (identifier) o item no carrinho
            if(key > -1) { //se achou O identfier
                cart[key].qt += modalQt; // adiciona mais a quantidade selecionada no item localizado
            } else {
                cart.push({
                    identifier,
                    id:cakeJson[modalKey].id, // identificar qual é o bolos
                    size, // tamanho
                    qt:modalQt //quantidade
                });
            }
            updateCart(); // antes de fechar passa as informaçoes para o carrinho   
            closeModal(); // fecha o modal
        });

    // ação de click no menu carrinhho mobile ↓
        c('.menu-openner span').addEventListener('click', () =>{ // evento de click no carrinho (mobile)
            if (cart.length > 0){ // se tiver algum item no carrinho, então o carrinho é clicável.
                c('aside').style.left = '0'; // ele está toto para direita então deve mudar para esquerda
            } 
        });
        c('.menu-closer').addEventListener('click', () =>{ // função fechar  a visualização do carrinho mobile
            c('aside').style.left = '100vw';
        });
    // ação de click no menu carrinhho mobile ↑


    // atualizar o carrinho
    function updateCart() {
        c('.menu-openner span').innerHTML = cart.length;// atualiza o carrinho mobile

        // mostrar o carrinho ou não
        if(cart.length > 0) { // se tiver algum item no carrinho...
            c('aside').classList.add('show'); // aparecer o carriho
            c('.cart').innerHTML = ''; //zerar o carrinho antes de atualizar = zera-mostra-zera-mostra...

            let subtotal = 0;
            let desconto = 0;
            let total = 0;
            
            for(let i in cart) { // id do item
                let cakeItem = cakeJson.find((item)=>item.id == cart[i].id); // retorna o item iteiro
                subtotal += cakeItem.price * cart[i].qt; //preço + qnt de item

                
                
                let cartItem = c('.models .cart--item').cloneNode(true);// clona o carrinho

                //preenchendo as informações
                    let cakeSizeName; // tamanho do bolo
                    switch(cart[i].size) {
                        case 0:
                            cakeSizeName = 'P';
                            break;
                        case 1:
                            cakeSizeName = 'M';
                        break;
                        case 2:
                            cakeSizeName = 'G';
                        break;
                    } 
                    let cakeName = `${cakeItem.name} (${cakeSizeName})`;
            
                    cartItem.querySelector('img').src = cakeItem.img; // imagem
                    cartItem.querySelector('.cart--item-nome').innerHTML = cakeName; //nome do bolo  + tamanho
                    cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //quantidade de bolos
                    
                    // quantidade e botão + e -
                        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                            if(cart[i].qt > 1) {
                                cart[i].qt--; // subitrai a quantidade clicado em -
                            } else {
                                cart.splice(i, 1); // remove o item do carrinho se zerar a quantidade
                            }
                            updateCart(); // atualiza o carrinho
                        });
                        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                            cart[i].qt++; // adicionado mais quantidade no item do carrinho quando clicado em +
                            updateCart(); // atualiza o carrinho
                        });

                c('.cart').append(cartItem); //adiciona os dados no carrinho
            }

            // calcular o subtotal
            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


        } else { // se não tem item no carrinho...
            c('aside').classList.remove('show'); // oculta o carriho
            c('aside').style.left = '100vw'; // oculta mobile
        }
    }