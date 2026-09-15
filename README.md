Kamba

Sistema de vendas desenvolvido com React Native, Expo e SQLite, voltado para gestão de produtos, vendas, itens vendidos e emissão de faturas/recibos.

🚀 Tecnologias
React Native
Expo
Expo Router
Expo SQLite
TypeScript
NativeWind
Feather Icons
📁 Estrutura do projeto
app/
├── (tabs)/
├── vendas/
├── produtos/
└── ...

src/
├── repositories/
├── services/
├── types/
├── database/
└── ...

A aplicação utiliza o Expo Router para navegação baseada em arquivos.

🗄️ Banco de dados

O Kamba utiliza SQLite para armazenamento local.

Principais entidades:

                    ┌──────────────┐
                    │   produtos   │
                    └──────┬───────┘
                           │
                           │ N:1
                           ▼

┌──────────────┐ ┌──────────────┐
│ vendas │────▶│ itens_venda │
└──────┬───────┘ 1:N └──────────────┘
│
│ 1:1
▼
┌──────────────┐
│ faturas │
└──────────────┘

Relacionamentos
Uma venda possui vários itens.
Cada item pertence a uma venda.
Cada item referencia um produto.
Cada venda possui uma fatura.
Uma fatura pertence a uma única venda.
A exclusão de uma venda remove automaticamente seus itens e sua fatura.
Um produto não pode ser excluído enquanto estiver associado a uma venda.
💾 Persistência da fatura

A fatura também possui um campo fatura_json, utilizado para armazenar um snapshot dos dados da venda.

Os dados são convertidos para JSON antes de serem armazenados:

await faturaRepository.create({
venda_id: sale.saleId,
numero: `00${sale.saleId}`,
fatura_json: JSON.stringify(sale),
});

Ao recuperar os dados:

const sale = JSON.parse(fatura.fatura_json);

Isso permite manter uma cópia dos dados utilizados na emissão do recibo.

🧱 Arquitetura

O projeto utiliza uma separação por responsabilidades:

Tela
│
▼
Repository
│
▼
SQLite

Os Repositories são responsáveis pelo acesso ao banco de dados, enquanto os Services concentram regras e funcionalidades específicas da aplicação.

⚙️ Instalação

Clone o projeto e instale as dependências:

npm install

▶️ Executar

Inicie o projeto com:

npx expo start

Depois escolha uma das opções disponíveis:

Android Emulator
iOS Simulator
Expo Go
Development Build
📱 Desenvolvimento

Os arquivos da aplicação estão dentro do diretório:

app/

Como o projeto utiliza Expo Router, as rotas são definidas através da estrutura de arquivos.

🗃️ Migrações

As alterações no banco de dados são organizadas através de migrações.

Exemplo:

export async function migrateV2(db: SQLiteDatabase) {
await db.execAsync(`     ...
  `);
}

Isso permite evoluir a estrutura do banco sem perder os dados existentes.

🧪 Desenvolvimento

Para verificar problemas de TypeScript:

npx tsc --noEmit

Para iniciar o projeto:

npx expo start

📌 Status

🚧 Em desenvolvimento

O Kamba está sendo desenvolvido continuamente, com funcionalidades de vendas, produtos, persistência local e emissão de recibos.

📄 Licença

Este projeto é privado e destinado ao desenvolvimento do sistema Kamba.

:::

Se quiser, também posso fazer uma versão **mais bonita de GitHub**, com badges, screenshots, funcionalidades, arquitetura, banco de dados e instruções de build/Android.
