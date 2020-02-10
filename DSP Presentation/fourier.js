class Complex {
    constructor (a, b = 0) {
        if (b != 0) {
            this.real = a;
            this.imag = b;
        } else {
            a = cos(a);
            b = sin(a);
        }
    }

    add(c) {
        const real = this.real + c.real;
        const imag = this.imag + c.imag;
        return new Complex(real, imag);
    }

    multiply(c) {
        const real = this.real * c.real - this.imag * c.imag;
        const imag = this.real * c.imag + this.imag * c.real;
        return new Complex(real, imag);
    }

    divide(N) {
        const real = this.real/N;
        const imag = this.imag/N;
        return new Complex(real, imag);
    }

    magnitude() {
        return sqrt(this.real*this.real + this.imag*this.imag);
    }

    phase() {
        return atan2(this.imag, this.real);
    }
}

function dft (x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
        let sum = new Complex (0, 0);
        for (let n = 0; n < N; n++) {
            const phi = (TWO_PI*k*n)/N; 
            const c = new Complex(cos(phi), -sin(phi));
            sum = sum.add(x[n].multiply(c));
        }
        sum = sum.divide(N);
        
        let freq = k;
        let amp = sum.magnitude();
        let phase = sum.phase();
    
        X[k] = { real: sum.real, imag: sum.imag, freq, amp, phase };
    }
    return X;
}

