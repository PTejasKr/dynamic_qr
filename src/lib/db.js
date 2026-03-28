import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

// Ensure the db exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ qrs: [] }));
}

export function getDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export function saveToDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function addQR(qr) {
  const db = getDB();
  db.qrs.push(qr);
  saveToDB(db);
  return qr;
}

export function getQR(id) {
  const db = getDB();
  return db.qrs.find((q) => q.id === id);
}

export function incrementScan(id) {
  const db = getDB();
  const index = db.qrs.findIndex((q) => q.id === id);
  if (index !== -1) {
    db.qrs[index].scans += 1;
    saveToDB(db);
  }
}

export function updateQR(id, newData) {
  const db = getDB();
  const index = db.qrs.findIndex((q) => q.id === id);
  if (index !== -1) {
    db.qrs[index] = { ...db.qrs[index], ...newData };
    saveToDB(db);
    return db.qrs[index];
  }
  return null;
}

export function getAllQRs() {
  return getDB().qrs;
}
