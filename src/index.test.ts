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

test('.1+.2', () => {
    expect(express.exec('.1+.2')).toBe(0.30000000000000004)
});

test('-1+2', () => {
    expect(express.exec('-1+2')).toBe(1)
});

test('-1+-2', () => {
    expect(express.exec('-1+-2')).toBe(-3)
});

test('2-1', () => {
    expect(express.exec('2-1')).toBe(1)
});

test('(5+2)-1-1', () => {
    expect(express.exec('(5+2)-1-1')).toBe(5)
});

test('-12+-2*3+(5+2)+1+5-1', () => {
    expect(express.exec('-12+-2*3+(5+2)+1+5-1')).toBe(-6)
});

