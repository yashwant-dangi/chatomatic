import React from "react";
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'

function Signup() {
    return (
        <div class="flex flex-col items-center my-8 mx-auto w-80 gap-4">
            <Input placeholder="phone" />
            <Input placeholder="name" />
            <Button>Signup</Button>
        </div>
    )
}

export default Signup;