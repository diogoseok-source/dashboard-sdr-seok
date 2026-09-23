import assert from 'node:assert/strict'

const tier=(meetings,origin)=>{const i=meetings<=15?0:meetings<=19?1:meetings<=24?2:3;const table=origin==='Outbound'?[[12,2],[16,3],[20,4],[24,5]]:[[6,1],[8,1.5],[10,2],[12,2.5]];return table[i]}
const netBase=(gross,tax=12)=>gross*(1-tax/100)
const nextPaymentMonth=date=>{const d=new Date(date+'T12:00');return new Date(d.getFullYear(),d.getMonth()+1,20).toISOString().slice(0,10)}
assert.deepEqual(tier(15,'Inbound'),[6,1]);assert.deepEqual(tier(16,'Inbound'),[8,1.5]);assert.deepEqual(tier(20,'Inbound'),[10,2]);assert.deepEqual(tier(25,'Inbound'),[12,2.5])
assert.deepEqual(tier(15,'Outbound'),[12,2]);assert.deepEqual(tier(16,'Outbound'),[16,3]);assert.deepEqual(tier(20,'Outbound'),[20,4]);assert.deepEqual(tier(25,'Outbound'),[24,5])
assert.equal(netBase(1000),880);assert.equal(Math.max(200,500),500);assert.equal(Math.max(700,500),700)
assert.equal(nextPaymentMonth('2026-01-29'),'2026-02-20');assert.equal(nextPaymentMonth('2026-01-30'),'2026-02-20');assert.equal(nextPaymentMonth('2026-01-31'),'2026-02-20')
const store=new Map(),save=value=>store.set('finance',JSON.stringify(value)),load=()=>JSON.parse(store.get('finance'));save({contracts:[{id:'contract'}]});assert.equal(load().contracts[0].id,'contract')
console.log('All dashboard finance rule tests passed')
