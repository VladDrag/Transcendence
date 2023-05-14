> **[react-storage-hook](README.md)**

[Globals]() / [react-storage-hook](README.md) /

**`requires`** prop-types

**`requires`** react

**`requires`** react-dom

**`summary`** A react state hook that is synchronised and persisted in localStorage, and between tabs.

**`version`** 1.0.0

**`author`** zemnmez

**`copyright`** zemnmez 2019

**`license`** MIT
## Installation

```bash
yarn add react-storage-hook
```
Check out the [live example](https://zemnmez.github.io/react-storage-hook)!
## Example

**`example`** 

```javascript
import React from 'react'
import { useStorage } from 'react-storage-hook'

export const SavedTextarea = () => {
  const [text, setText] = useStorage('saved-text', {
    placeholder: ""
  });

  const onChange = e => setText(e.target.value);

  return <textarea {...{
    onChange,
    value: text
  }}/>
}
```

### Index

#### Type aliases

* [immutableValue](README.md#immutablevalue)

#### Functions

* [useStorage](README.md#const-usestorage)

## Type aliases

###  immutableValue

Ƭ **immutableValue**: *any*

*Defined in [index.tsx:21](https://github.com/Zemnmez/react-storage-hook/blob/71ee183/src/index.tsx#L21)*

An immutableValue is a value that would be returned
by immutable.js's [immutable.fromJS](https://github.com/immutable-js/immutable-js/wiki/Converting-from-JS-objects).

## Functions

### `Const` useStorage

▸ **useStorage**<**InputType**>(`name`: *string*, `__namedParameters`: *object*): *[[immutableValue](README.md#immutablevalue), `setStored<InputType>`]*

*Defined in [index.tsx:39](https://github.com/Zemnmez/react-storage-hook/blob/71ee183/src/index.tsx#L39)*

useStorage is a react hook providing integration and synchronization with
localStorage. The value returned will likely not be the same type as input,
unless the input type is an immutable value that
would be produced by immutable.js.

The output value will always be an [immutableValue](README.md#immutablevalue) of the kind produced by
immutable.js.

**Type parameters:**

▪ **InputType**: *`__type`*

**Parameters:**

▪ **name**: *string*

The key used to store the data in.

▪ **__namedParameters**: *object*

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`placeholder` | `InputType` | - | The default value if no stored value is found. |
`storageArea` | `Storage` |  window.localStorage | The Storage used. Defaults to localStorage. |

**Returns:** *[[immutableValue](README.md#immutablevalue), `setStored<InputType>`]*
