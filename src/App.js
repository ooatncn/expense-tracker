import React, { useState, useEffect } from 'react'; 
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('อาหาร');
  const [catFilter, setCatFilter] = useState('ทั้งหมด');
  const [dateFilter, setDateFilter] = useState('ทั้งหมด');


  const [transactions, setTransactions] = useState(() => {
    const savedData = localStorage.getItem('my_transactions');
    return savedData ? JSON.parse(savedData) : [];
  });


  useEffect(() => {
    localStorage.setItem('my_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (text === '' || amount === 0 || amount === '') return alert('กรุณากรอกข้อมูลให้ครบ');
    const newTransaction = { 
      id: Math.random(), 
      text, 
      amount: +amount, 
      category,
      date: new Date().toISOString() 
    };
    setTransactions([newTransaction, ...transactions]);
    setText(''); setAmount('');
  };

  const filteredTransactions = transactions.filter(t => {
    const matchCat = catFilter === 'ทั้งหมด' ? true : t.category === catFilter;
    
    const transDate = new Date(t.date);
    const today = new Date();
    const diffTime = Math.abs(today - transDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let matchDate = true;
    if (dateFilter === 'วันนี้') {
      matchDate = transDate.toDateString() === today.toDateString();
    } else if (dateFilter === '7วันล่าสุด') {
      matchDate = diffDays <= 7;
    } else if (dateFilter === 'เดือนนี้') {
      matchDate = transDate.getMonth() === today.getMonth() && transDate.getFullYear() === today.getFullYear();
    }

    return matchCat && matchDate;
  });

  const total = transactions.reduce((acc, item) => acc + item.amount, 0).toFixed(2);

  const income = transactions
    .filter(item => item.amount > 0)
    .reduce((acc, item) => acc + item.amount, 0).toFixed(2);

  const expense = (transactions
    .filter(item => item.amount < 0)
    .reduce((acc, item) => acc + item.amount, 0) * -1).toFixed(2);

  return (
    <div className="container">
      <h2>💰 ถุงเงิน Expense Tracker</h2>
      
      <div className="balance-card">
        <h4>ยอดคงเหลือรวม</h4>
        <h1>฿{total}</h1>
      </div>

      <div className="inc-exp-container">
        <div className="inc-box">
          <h4>รายรับ</h4>
          <p className="money plus">+฿{income}</p>
        </div>
        <div className="exp-box">
          <h4>รายจ่าย</h4>
          <p className="money minus">-฿{expense}</p>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-item">
          <label>📅 ช่วงเวลา:</label>
          <select onChange={(e) => setDateFilter(e.target.value)}>
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="วันนี้">วันนี้</option>
            <option value="7วันล่าสุด">7 วันล่าสุด</option>
            <option value="เดือนนี้">เดือนนี้</option>
          </select>
        </div>
        <div className="filter-item">
          <label>📂 หมวดหมู่:</label>
          <select onChange={(e) => setCatFilter(e.target.value)}>
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="อาหาร">อาหาร</option>
            <option value="เดินทาง">เดินทาง</option>
            <option value="บันเทิง">บันเทิง</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
      </div>

      <ul className="list">
        {filteredTransactions.map(t => (
          <li key={t.id} className={t.amount < 0 ? 'minus' : 'plus'}>
            <div>
              <strong>{t.text}</strong> <small>({t.category})</small>
              <br/><span className="date">{new Date(t.date).toLocaleDateString('th-TH')}</span>
            </div>
            <span>{t.amount < 0 ? '-' : '+'}{Math.abs(t.amount)}</span>
          </li>
        ))}
        {filteredTransactions.length === 0 && <p style={{textAlign:'center', color:'#888', margin:'20px'}}>ไม่พบรายการ</p>}
      </ul>

      <form onSubmit={addTransaction} className="add-form">
        <h3>➕ เพิ่มรายการใหม่</h3>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="ชื่อรายการ..." />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="จำนวนเงิน (ลบ=รายจ่าย)" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="อาหาร">อาหาร</option>
          <option value="เดินทาง">เดินทาง</option>
          <option value="บันเทิง">บันเทิง</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
        <button className="btn">บันทึกข้อมูล</button>
      </form>
    </div>
  );
}

export default App;