function dft (x) {
    const X = [];
    const N = x.length;
    for (let k = 0; k < N; k++) {
        let real = 0;
        let imag = 0;

        for (let n = 0; n < N; n++) {
            const phi = (TWO_PI*k*n)/N; 
            real += x[n]*cos(phi);
            imag -= x[n]*sin(phi);
        }
        real = real/N;
        imag = imag/N;
        
        let freq = k;
        let amp = sqrt(real*real + imag*imag);
        let phase = atan2(imag, real);
    
        X[k] = { real, imag, freq, amp, phase };
    }
    return X;
}