import React, { ReactNode } from 'react'
import styled   from 'styled-components'

export function Page({children}:{children: ReactNode}) {
  return <Container>{children}</Container>;
}


const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`