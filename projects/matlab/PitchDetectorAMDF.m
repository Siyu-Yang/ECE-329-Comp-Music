function freq = PitchDetectorAMDF(BlockDate)
global min_freq max_freq block_size;
global Fs ;
min_shift = floor(Fs / max_freq);
max_shift = ceil(Fs / min_freq);
R0 = zeros(block_size,1); 
R = zeros(block_size,1);
u = BlockDate;
wlen = block_size;
for m = 1:block_size
    R0(m) = sum(abs(u(m:wlen)-u(1:wlen-m+1)));  % ����ƽ�����Ȳ��
end
[Rmax,Nmax]=max(R0);                            % ��ȡAMDF�����ֵ�Ͷ�Ӧλ��
for i = 1 : block_size                          % �������Ա任
    R(i)=Rmax*(wlen-i)/(wlen-Nmax)-R0(i);
end
[Rmax,T]=max(R(min_shift:max_shift));           % ������ֵ
T0=T+min_shift-1;
period = T0;
freq = 1/period*Fs;
end