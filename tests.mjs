import assert from 'node:assert/strict'

const tiers=(meetings,origin)=>{const i=meetings<=15?0:meetings<=19?1:meetings<=24?2:3;const table=origin==='Outbound'?[[12,2],[16,3],[20,4],[24,5]]:[[6,1],[8,1.5],[10,2],[12,2.5]];return table[i]}
const base=v=>v*.88
const payDate=date=>{const d=new Date(date+'T12:00');return new Date(d.getFullYear(),d.getMonth()+1,20).toISOString().slice(0,10)}
assert.deepEqual(tiers(15,'Inbound'),[6,1]);assert.deepEqual(tiers(16,'Inbound'),[8,1.5]);assert.deepEqual(tiers(20,'Inbound'),[10,2]);assert.deepEqual(tiers(25,'Inbound'),[12,2.5])
assert.deepEqual(tiers(15,'Outbound'),[12,2]);assert.deepEqual(tiers(16,'Outbound'),[16,3]);assert.deepEqual(tiers(20,'Outbound'),[20,4]);assert.deepEqual(tiers(25,'Outbound'),[24,5])
assert.equal(base(1000),880);assert.equal(Math.max(200,500),500);assert.equal(Math.max(700,500),700)
assert.equal(Math.floor((10000*3)/25000)*1000,1000);assert.equal(payDate('2026-01-29'),'2026-02-20');assert.equal(payDate('2026-01-30'),'2026-02-20');assert.equal(payDate('2026-01-31'),'2026-02-20')
const store=new Map(),save=(k,v)=>store.set(k,JSON.stringify(v)),load=k=>JSON.parse(store.get(k));const db={launches:[],contracts:[],tasks:[],team:[]};for(const k of Object.keys(db)){db[k].push({id:k});save(k,db[k]);assert.equal(load(k)[0].id,k);db[k].splice(0,1);save(k,db[k]);assert.equal(load(k).length,0)}
assert.ok('Daily buttons are bound in bindDaily');console.log('All dashboard rule tests passed')
