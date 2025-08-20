import { AbstractControl, ValidationErrors } from '@angular/forms';


export function somenteDigitos(value: string): string {
return (value || '').replace(/\D/g, '');
}


export function cepValidator(control: AbstractControl): ValidationErrors | null {
const v = somenteDigitos(control.value);
return v.length === 8 ? null : { cepInvalido: true };
}


export function cpfValidator(control: AbstractControl): ValidationErrors | null {
const cpf = somenteDigitos(control.value);
if (cpf.length !== 11) return { cpfInvalido: true };
if (/^(\d)\1{10}$/.test(cpf)) return { cpfInvalido: true }; // elimina sequências


const calcDV = (base: string, factor: number) => {
let total = 0;
for (let i = 0; i < base.length; i++) total += parseInt(base[i], 10) * (factor - i);
const resto = total % 11;
return resto < 2 ? 0 : 11 - resto;
};


const dv1 = calcDV(cpf.substring(0, 9), 10);
const dv2 = calcDV(cpf.substring(0, 9) + dv1, 11);
const valido = cpf.endsWith(`${dv1}${dv2}`);
return valido ? null : { cpfInvalido: true };
}