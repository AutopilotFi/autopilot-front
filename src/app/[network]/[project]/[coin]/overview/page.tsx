import Dashboard from "@/components/App/Dashboard";

export default async function EditDealPage({
    params
} : {
    params: {
        network: string,
        project:string,
        coin: string
    }
}){
    const {network, project, coin} = await params;
    console.log(coin);
    return(
        <>
            {/* <Dashboard/>    */}
        </>
    )
}
