import express from "./index"

test("parsing", () => {
    expect(express.parsing('1+2+3').length).toBe(5)
});

test(" 1 + 22 + 3 ", () => {
    expect(express.exec(' 1 + 22 + 3 ')).toBe(26)
});

test('1+2+2*3+5*(2+1)+5', () => {
    expect(express.exec('1+2+2*3+5*(2+1)+5')).toBe(29)
});


test('1+2+2*(3+5*(2+1))+5', () => {
    expect(express.exec('1+2+2*(3+5*(2+1))+5')).toBe(44)
});

test('3+5*(2+1)', () => {
    expect(express.exec('3+5*(2+1)')).toBe(18)
});

test('2*5', () => {
    expect(express.exec('2*5')).toBe(10)
});

test('0.1+0.2', () => {
    expect(express.exec('0.1+0.2')).toBe(0.30000000000000004)
});
