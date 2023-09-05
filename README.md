# Projeto de Integração entre Front-end e Back-end

Este projeto consiste em um sistema de integração entre o front-end e o back-end, onde o front-end é responsável pela exibição dos dados e o back-end pela persistência dos mesmos.

## Configuração

BANCO

```
CREATE TABLE products
(
code bigint PRIMARY KEY, # CODIGO DO PRODUTO
name varchar(100) NOT NULL, # NOME DO PRODUTO
cost_price decimal(9,2) NOT NULL, # CUSTO DO PRODUTO
sales_price decimal(9,2) NOT NULL # PRE�O DE VENDA DO PRODUTO
);

INSERT INTO products VALUES (16,'AZEITE PORTUGUÊS EXTRA VIRGEM GALLO 500ML',18.44,20.49);
INSERT INTO products VALUES (18,'BEBIDA ENERGÉTICA VIBE 2L',8.09,8.99);
INSERT INTO products VALUES (19,'ENERGÉTICO RED BULL ENERGY DRINK 250ML',6.56,7.29);
INSERT INTO products VALUES (20,'ENERGÉTICO RED BULL ENERGY DRINK 355ML',9.71,10.79);
INSERT INTO products VALUES (21,'BEBIDA ENERGÉTICA RED BULL RED EDITION 250ML',10.71,11.71);
INSERT INTO products VALUES (22,'ENERGÉTICO RED BULL ENERGY DRINK SEM AÇÚCAR 250ML',6.74,7.49);
INSERT INTO products VALUES (23,'ÁGUA MINERAL BONAFONT SEM GÁS 1,5L',2.15,2.39);
INSERT INTO products VALUES (24,'FILME DE PVC WYDA 28CMX15M',3.59,3.99);
INSERT INTO products VALUES (26,'ROLO DE PAPEL ALUMÍNIO WYDA 30CMX7,5M',5.21,5.79);
INSERT INTO products VALUES (1000,'BEBIDA ENERGÉTICA VIBE 2L - 6 UNIDADES',48.54,53.94);
INSERT INTO products VALUES (1010,'KIT ROLO DE ALUMINIO + FILME PVC WYDA',8.80,9.78);
INSERT INTO products VALUES (1020,'SUPER PACK RED BULL VARIADOS - 6 UNIDADES',51.81,57.00);

CREATE TABLE packs
(
id bigint AUTO_INCREMENT PRIMARY KEY, # id primario da tabela
pack_id bigint NOT NULL, # id do produto pack
product_id bigint NOT NULL, # id do produto componente
qty bigint NOT NULL, # quantidade do produto componente no pack
CONSTRAINT FOREIGN KEY (pack_id) REFERENCES products(code),
CONSTRAINT FOREIGN KEY (product_id) REFERENCES products(code)
);

INSERT INTO packs (pack_id,product_id, qty) VALUES (1000,18,6);
INSERT INTO packs (pack_id,product_id, qty) VALUES (1010,24,1);
INSERT INTO packs (pack_id,product_id, qty) VALUES (1010,26,1);
INSERT INTO packs (pack_id,product_id, qty) VALUES (1020,19,3);
INSERT INTO packs (pack_id,product_id, qty) VALUES (1020,21,3);
```


Antes de iniciar o projeto é necessário configurar as variáveis de ambiente. Para isso, é necessário criar um arquivo .env na raiz do projeto com base no arquivo .env.example, que também se encontra na raiz. As variáveis de ambiente que precisam ser configuradas são:

1. DB_USER: seu usuário do MySQL

2. DB_PASSWORD: sua senha do MySQL

3. DB_NAME: nome do seu banco de dados MySQL

4. PORT_SERVER: porta para o servidor, caso vazio vira com padrão 5000

Instalar node(ou yarn) para poder executar os comandos

Para baixar os módulos necessários utilize

### npm i

## Back-end

O back-end consiste em um servidor Node.js que se comunica com um banco de dados MySQL. O servidor disponibiliza quatro rotas:

/products/:id: retorna um produto específico com base no código passado como parâmetro.
/packs/:id: retorna um pacote específico com base no ID do produto passado como parâmetro.
/products/: retorna todos os produtos.
/packs/: retorna todos os pacotes.
Também é possível atualizar os preços de vários produtos de uma só vez utilizando a rota /update-products.

Para iniciar o server execute o seguinte comando

### npm run server

## Front-end

O front-end consiste em uma página web que exibe os dados fornecidos pelo servidor. É possível filtrar os dados por código ou por nome do produto, criado a partir do npx create-react-app.

O front-end utiliza a biblioteca React e possui dois componentes principais:

ProductTable: exibe a lista de produtos e pacotes.
CsvDownloadButton: botão que permite baixar um arquivo CSV contendo a lista de produtos e pacotes.
Para iniciar o front-end, execute o seguinte comando:

Para iniciar o front-end

### npm start

## Projeto desenvolvido para entrevista de emprego com os seguintes requisitos

## Cenário

Em qualquer empresa de e-commerce é essencial que os usuários possam atualizar os preços de suas lojas para se manterem competitivos e manterem seus preços alinhados com os custos de operação. Essa tarefa parece simples, porém quando falamos de lojas com milhares de produtos, se torna essencial a existência de uma ferramenta que permita atualizar os produtos de forma massiva e com recursos adicionais para evitar erros que possam prejudicar o negócio. Você foi encarregado de desenvolver essa ferramenta e após uma série de reuniões com as áreas envolvidas, os seguintes requisitos foram levantados:

1. O time Compras, responsável por definir os preços, se comprometeu em gerar um arquivo CSV contendo código do produto e o novo preço que será carregado. Ex.:product_code,new_price na primeira linha e 16,25.50 na linha abaixo

2. O time Financeiro, preocupado com o faturamento, solicitou que o sistema impeça que o preço de venda dos produtos fique abaixo do custo deles;

3. O time de Marketing, preocupado com o impacto de reajustes nos clientes, solicitou que o sistema impeça qualquer reajuste maior ou menor do que 10% do preço atual do produto

4. Alguns produtos são vendidos em pacotes, ou seja, um produto que composto por um ou mais produtos em quantidades diferentes.

Estabeleceu-se a regra que, ao reajustar o preço de um pacote, o mesmo arquivo deve conter os reajustes dos preços dos componentes do pacote de modo que o preço final da soma dos componentes seja igual ao preço do pacote.

## Exemplos 1 -

Imagine o produto PACK GUARANA 1L – 6 Unidades

Ele é composto por 6 unidades do produto GUARANA 1L

O preço do pack é de R$ 24,00. O preço do componente é de R$ 4,00.

Se o arquivo do time de precificação pedir um reajuste do preço do pacote para R$ 30,00, o mesmo arquivo deve conter o reajuste do preço do componente, no caso mudando o preço para R$ 5,00 (6 x 5 = 30)

## Exemplos 2 -

Imaginando o produto KIT ESCOVA DE DENTE + PASTA DE DENTE, vendido a R$ 25,00 O produto é composto por 1 unidade do produto ESCOVA DE DENTES (R$ 10,00) e 1 unidade do produto PASTA DE DENTE (R$ 15,00). Se o preço da ESCOVA DE DENTES for reajustado para R$ 20,00, o arquivo também deve conter um reajuste do preço do pacote para R$ 35,00 (R$ 20,00 + R$ 15,00)

A ferramenta deve impedir atualizações de preço que quebrem essa regra

REQUISITOS
Diante desse cenário, você deve construir um sistema com os seguintes requisitos:

1. O sistema deve ter um back end (node.js), contendo as todas as regras definidas e um front-end (React.js) que será utilizado pelo usuário da ferramenta
2. Você deve escrever seu código em Javascript ou TypeScript (preferencialmente)
3. O banco de dados deve ser MySQL (versão 5 ou 8)
4. O sistema deve permitir que o usuário carregue o arquivo de precificação
5. O sistema deve ter um botão chamado VALIDAR.
6. Ao clicar em VALIDAR, o sistema deve ler todo o arquivo e fazer as seguintes verificações:
7. Todos os campos necessários existem?
8. Os códigos de produtos informados existem?
9. Os preços estão preenchidos e são valores numéricos validos.?
10. O arquivo respeita as regras levantadas na seção cenário?
11. Ao final da validação o sistema deve exibir as seguintes informações dos produtos que foram enviados
12. Código, Nome, Preço Atual, Novo Preço
13. Caso uma ou mais regras de validação tenham sido quebradas, o sistema também deve exibir ao lado de cada produto qual regra foi quebrada.
14. O sistema também deve ter um botão ATUALIZAR. Que só ficará habilitado se todos os produtos dos arquivos estiverem validados e sem regras quebradas
15. Ao clica em ATUALIZAR, o sistema deve salvar o novo preço no banco de dados e já deixar a tela pronta para o envio de um novo arquivo.
16. O preço de custo dos pacotes também deve ser atualizado como a soma dos custos dos seus componentes. Os preço de custo dos produtos que não são pacotes não deve ser atualizado

