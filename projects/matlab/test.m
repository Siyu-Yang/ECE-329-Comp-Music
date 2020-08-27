
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%  AutoTune
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clc;close all;clear;
%% Initialize
global block_size step_size Fs prediction_samples;
Initialize;

%% WaveRead
FileName  = 'song.wav';
[Sig,Fs] = audioread(FileName);
%Info = audioinfo(FileName);
N = floor((length(Sig)-block_size)/step_size);

%% Real-Time Processing
I = 1;
out = [];
target_freq = [];
freq_tmp =zeros(N,1);
Ratio = 0;
print = [];
for n = 1:N
    BlockDate = Sig(I:I+block_size-1);
    %PitchDetector
    [freq,target_freq]=PitchDetector(BlockDate,target_freq);
    freq_tmp(n) = freq;
    if n  >=prediction_samples
        f0_chunk = freq_tmp(n-prediction_samples+1:n);
        target_freq = f0_chunk(f0_chunk>0);
        if ~isempty(target_freq)
            target_freq = target_freq(end);
        end
   
    end   
    %PitchScaler
    tune = 'E';
%    scale = 'chrom';
     scale = 'major';
%    scale = 'minor';
%    scale = 'chromatic';
   
    
    Ratio=PitchScale(freq, tune, scale);
    print =[print;Ratio];
    %PitchShifter
    CorrectedDate = PitchShift(Sig(I:I+step_size-1),Ratio);  
    I = I + step_size;
    out = [out;CorrectedDate];
end
%% WaveWrite
OutFileName = [FileName(1:end-4) '_' tune '_' scale '_lu_1024.wav'];
audiowrite(OutFileName,out,Fs);





