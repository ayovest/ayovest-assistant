import logo from './logo.svg';
import './App.css';
import { Box, Button, Flex, Image, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MathJax from 'react-mathjax';

export const currency_converter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
});

export const percent_converter = (n) => {
  return Number(n ?? 0).toLocaleString(undefined, {style: 'percent', minimumFractionDigits:2})
}

function ItemInputNumber(props) {
  return (
    <Flex 
      gap={'12px'}
      align={'center'}
      w={'550px'}>
      <Text flex={2}>
        { props.label ?? '' }{ props.required &&  <span style={{ color: 'red' }}>*</span> }
      </Text>
      <NumberInput 
        flex={5} 
        min={0}
        float={props.float}
        value={props.value ?? 0}
        step={props.step}
        onChange={props.onValueChange}
        format={props.converter ?? currency_converter.format}>
        <NumberInputField
          placeholder={props.label}  />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
}

function App() {
  const [data, setData] = useState({
    target_investasi: 2000000000,
    nilai_investasi_awal: 2e7,
    return_tahunan: 2.5e-2,
    lama_investasi_dalam_bulan: 240,
    rencana_investasi_bulanan: 2.5e6
  });
  const [tex_data, setTexData] = useState('');
  const C = Math.pow(parseFloat(data.return_tahunan) + 1, 1 / 12);
  const C_0_to_t_1 = Array(data.lama_investasi_dalam_bulan ?? 0).fill(0).reduce((a, _, i) => a + Math.pow(C, i), 0);
  const C_to_t = Math.pow(C, data.lama_investasi_dalam_bulan);
  const I = (data.target_investasi - data.nilai_investasi_awal * C_to_t) / C_0_to_t_1;

  useEffect(() => {
    setTexData(`
      a_t = \\text{${currency_converter.format(data.target_investasi)}} \\\\ 
      I_0 = \\text{${currency_converter.format(data.nilai_investasi_awal)}} \\\\ 
      R = \\text{${percent_converter(data.return_tahunan)}} \\\\ 
      t = \\text{${data.lama_investasi_dalam_bulan} bulan} \\\\ 
      C = 1 + f'(R) \\\\ 
      C = 1 + \\sqrt[12]{R + 1} - 1 \\\\ 
      C = ${C} \\\\ 
      C^{${data.lama_investasi_dalam_bulan}} = ${C_to_t} \\\\ 
      \\sum_{i=0}^{${data.lama_investasi_dalam_bulan - 1}} C^{i} = ${C_0_to_t_1} \\\\ 
      \\; \\\\
      I = \\frac{a_t - I_0 \\cdot C^t}{\\sum_{i=0}^{t-1} C^{i}} \\\\ 
      \\; \\\\
      I = \\frac{\\text{${currency_converter.format(data.target_investasi)}} - \\text{${currency_converter.format(data.nilai_investasi_awal)}} \\cdot ${C_to_t}}{${C_0_to_t_1}} \\\\ 
      \\; \\\\
      I = \\text{${currency_converter.format(I)}}
      \\; \\\\
      \\; \\\\
      \\text{Jumlah kekurangan uang investasi bulanan} = I - \\text{rencana investasi bulanan} \\\\
      \\text{Jumlah kekurangan uang investasi bulanan} = \\text{${currency_converter.format(I - data.rencana_investasi_bulanan)}} \\\\
      \\; \\\\
    `);
  }, [data]);

  return (
    <Flex
      p={'48px'}
      gap={'12px'}
      direction={'column'}>
      <Text 
        fontWeight={700}
        fontSize={18}>
        Kalkulator Investasi Ayovest
      </Text>
      <Flex
        gap={'12px'}
        direction={'row'}>
        <Flex 
          flex={1}
          direction={'column'}
          gap={'12px'}>
          <ItemInputNumber 
            label={'Target Investasi'}
            value={data.target_investasi}
            onValueChange={target_investasi => setData({ ...data, target_investasi })}
            required />
          <ItemInputNumber 
            label={'Nilai Investasi Awal'}
            value={data.nilai_investasi_awal}
            onValueChange={nilai_investasi_awal => setData({ ...data, nilai_investasi_awal })}
            required />
          <ItemInputNumber 
            label={'Return Tahunan'}
            value={data.return_tahunan}
            converter={n => n}
            float
            step={.001}
            onValueChange={return_tahunan => setData({ ...data, return_tahunan })}
            required />
          <ItemInputNumber 
            label={'Lama Investasi (dalam bulan)'}
            value={data.lama_investasi_dalam_bulan}
            converter={n => n}
            onValueChange={lama_investasi_dalam_bulan => setData({ ...data, lama_investasi_dalam_bulan })}
            required />
          <ItemInputNumber 
            label={'Rencana Investasi Bulanan'}
            value={data.rencana_investasi_bulanan}
            onValueChange={rencana_investasi_bulanan => setData({ ...data, rencana_investasi_bulanan })} />
          {/* <Flex 
            gap={'12px'}
            align={'center'}
            w={'550px'}>
            <Text flex={2}></Text>
            <Box flex={5}>
              <Button>
                Hitung
              </Button>
            </Box>
          </Flex> */}
          <br/>
        </Flex>
        <Flex
          flex={1}>
          <MathJax.Provider>
            <MathJax.Node formula={tex_data} />
          </MathJax.Provider>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
