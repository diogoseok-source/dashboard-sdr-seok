import assert from 'node:assert/strict'

const bands={Inbound:[[6,1],[8,1.5],[10,2],[12,2.5]],Outbound:[[12,2],[16,3],[20,4],[24,5]]}
const tier=(meetings,origin)=>bands[origin][meetings<=15?0:meetings<=19?1:meetings<=24?2:3]
const netBase=(gross,tax=12)=>gross*(1-tax/100)
const nextMonth=m=>{const [year,month]=m.split('-').map(Number);return `${year+(month===12?1:0)}-${String(month===12?1:month+1).padStart(2,'0')}`}
const eligible=c=>(c.isNew??'Sim')==='Sim'&&c.status!=='Perdido'&&!(c.status==='Cancelado'&&c.firstPaid!=='Sim')
const paymentForMonth=(c,receiptMonth)=>{
  if(!eligible(c))return {initial:0,recurring:0}
  const [initialRate,recurringRate]=tier(c.meetingsAtSigning,c.origin)
  const base=netBase(c.gross),firstMonth=c.firstPaymentDate?.slice(0,7)
  const initial=c.firstPaid==='Sim'&&nextMonth(firstMonth)===receiptMonth?base*initialRate/100:0
  const recurring=(c.recurringPayments||[]).filter(p=>{const paidMonth=p.date.slice(0,7);return paidMonth>firstMonth&&nextMonth(paidMonth)===receiptMonth}).length*base*recurringRate/100
  return {initial,recurring}
}

assert.deepEqual(tier(15,'Inbound'),[6,1]);assert.deepEqual(tier(16,'Inbound'),[8,1.5]);assert.deepEqual(tier(20,'Inbound'),[10,2]);assert.deepEqual(tier(25,'Inbound'),[12,2.5])
assert.deepEqual(tier(15,'Outbound'),[12,2]);assert.deepEqual(tier(16,'Outbound'),[16,3]);assert.deepEqual(tier(20,'Outbound'),[20,4]);assert.deepEqual(tier(25,'Outbound'),[24,5])
assert.equal(netBase(3000),2640);assert.equal(netBase(4000),3520);assert.equal(nextMonth('2026-09'),'2026-10');assert.equal(nextMonth('2026-12'),'2027-01')

const outbound={isNew:'Sim',status:'Assinado',origin:'Outbound',meetingsAtSigning:0,gross:4000,firstPaid:'Sim',firstPaymentDate:'2026-09-23',recurringPayments:[{date:'2026-09-23'}]}
assert.deepEqual(paymentForMonth(outbound,'2026-10'),{initial:422.4,recurring:0},'A primeira fatura nao pode gerar recorrencia no mesmo mes')
outbound.recurringPayments=[{date:'2026-10-23'}]
assert.deepEqual(paymentForMonth(outbound,'2026-11'),{initial:0,recurring:70.4},'A recorrencia inicia apenas na segunda fatura')
assert.deepEqual(paymentForMonth({...outbound,isNew:'Não'},'2026-11'),{initial:0,recurring:0},'Upsell e renovacao nao geram comissao')
assert.deepEqual(paymentForMonth({...outbound,status:'Cancelado',firstPaid:'Não',firstPaymentDate:'',recurringPayments:[]},'2026-11'),{initial:0,recurring:0},'Cancelamento antes da primeira fatura nao gera comissao')
assert.deepEqual(paymentForMonth({...outbound,status:'Cancelado',recurringPayments:[]},'2026-10'),{initial:422.4,recurring:0},'Cancelamento posterior nao retira a primeira comissao ja paga')
assert.equal(Math.max(0,500-300),200,'A garantia cobre apenas a diferenca ate R$ 500 de comissao')
assert.equal(Math.max(0,500-700),0,'A garantia nao se soma a comissao superior a R$ 500')

console.log('All SDR commission-contract tests passed')
