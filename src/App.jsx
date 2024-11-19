import { useState, useEffect } from 'react'
import './app.module.scss'
import jsPDF from "jspdf";
import "jspdf-autotable"

function App() {

  // Cria um estado para cada elemento
  const [codigo, setCodigo] = useState('');
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [dado, setDados] = useState([]);
  const [total, setTotal] = useState(0);
  const [pdfData, setPdfData] = useState([]);

  // Adiciona os dados a tabela e mostra os botões Remover e Gerar PDF, se houver entrada de dados
  const AddDados = () => {
    if (codigo.trim() && produto.trim() && preco.trim()) {
      setDados([...dado, {codigo, produto, preco: parseFloat(preco)}]);
      setCodigo('');
      setProduto('');
      setPreco('');
      setPdfData([...pdfData, {code: codigo, product: produto, value: preco}]);
      document.getElementById('removeBtn').style.display = 'block'
      document.getElementById('pdf').style.display = 'block'
    };
  };
 
  // Arrow function para calcular o preço de cada item da lista 
  const calcularTotal = () => {
    const totalValue = dado.reduce((acc, item) => acc + item.preco, 0);
    setTotal(totalValue);
  };

    // Arrow function para remover o último item da lista
    const removeItem = () => {
    setDados((lastDados) => lastDados.slice(0, -1));
  };
  
  // Atualiza os dados sempre que houver mudanças
  useEffect(() => {
    calcularTotal();
    // Condição para caso não houver nenhum entrada de dados ou, zerar os dados da tabela
    if (dado == 0) {
      document.getElementById('removeBtn').style.display = 'none'
      document.getElementById('pdf').style.display = 'none'
    }
  });

  // Função para gerar o PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Adicionando título
    doc.text("Tabela de Produtos", 14, 10);

    // Definindo as colunas e os dados da tabela
    const tableColumn = ["Código", "Produto", "Preço"];
    const tableRows = pdfData.map(item => [item.code, item.product, item.value]);
    
    // Gerando a tabela com jsPDF-autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20, // Espaço do título até a tabela
    });

    // Salva o PDF com o nome "tabela.pdf"
    doc.save("tabela.pdf");
  };

  return (  
      <section>
        
        <fieldset id='caixa-inserir'>
          <label htmlFor="codigo">Código:</label>
          <input type="text" name="codigo" id="codigo" value={codigo} placeholder='Código do produto' onChange={(e) => setCodigo(e.target.value)} />
          <label htmlFor="produto">Produto:</label>
          <input type="text" name='produto' id='produto' value={produto} placeholder='Nome do produto' onChange={(e) => setProduto(e.target.value)} />
          <label htmlFor="preco">Preço:</label>
          <input type="text" name='preco' id='preco' value={preco} placeholder='Preço do produto' onChange={(e) => setPreco(e.target.value)} />
          <button type='button' onClick={AddDados}>Adicionar</button>
          </fieldset>

          <table>
            <thead>
              <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Preço</th>
              </tr>
            </thead>
            <tbody>

            {dado.map((item, index) => (
              <tr key={index}>
                <td>{item.codigo}</td>
                <td>{item.produto}</td>
                <td>{'R$' + item.preco.toFixed(2)}</td>
              </tr>
            ))}
            </tbody>
            </table>

            <div>
              <h2>Total: {'R$' + total.toFixed(2)}</h2>
            </div>

            <button type="button" id='removeBtn' onClick={removeItem}>Remover</button>


            <section id='pdf'>
              <h3>Gerar Tabela PDF</h3>
            <button type='button' onClick={generatePDF}>Gerar PDF</button>
            </section>

      </section>
  );
};

export default App
