import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  multiline?: boolean;
};

export function Field<T extends FieldValues>({ control, name, label, error, placeholder, keyboardType, secureTextEntry, multiline }: Props<T>): React.JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.wrap}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            accessibilityLabel={label}
            value={String(value ?? '')}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder ?? label}
            placeholderTextColor="#77808a"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
            style={[styles.input, multiline && styles.multiline, error && styles.invalid]}
          />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: '#c9d1d9', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#161b22', borderColor: '#30363d', borderWidth: 1, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 12, color: '#fff', fontSize: 15 },
  multiline: { minHeight: 70, textAlignVertical: 'top' },
  invalid: { borderColor: '#f85149' },
  error: { color: '#ff7b72', fontSize: 12, marginTop: 4 },
});
