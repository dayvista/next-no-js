import { Item } from "~/ui/Item";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { categoryList, categoryList_categoryList, categoryListVariables } from "~/queries/__generated__/categoryList";
import categoryListQuery from "~/queries/categoryList.graphql";
import { initializeApollo } from "~/lib/apollo";
import invariant from "tiny-invariant";

interface Props {
    category: categoryList_categoryList | null;
}

export default function Category(props: Props) {
    return (
        <>
            <Head>
                <title>{props.category?.name}</title>
            </Head>
            <h3 className="text-gray-700 text-2xl font-medium">{props.category?.name}</h3>
            <p>
                <span className="mt-3 text-sm text-gray-500">{props.category?.products?.items?.length} Products</span>
            </p>
            <Link href={"/"}>Home</Link>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
                {props.category?.products?.items?.map((prod, index) => {
                    return (
                        <Item
                            item={{
                                image: prod?.image?.url || "n/a",
                                name: prod?.name || "n/a",
                                price: String(prod?.price_range.minimum_price.regular_price.value),
                                sku: prod?.sku || "n/a",
                            }}
                            index={index}
                            key={index}
                        />
                    );
                })}
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const { query } = context;
    invariant(typeof query.id === "number", "id expected");

    const client = initializeApollo({}, context);
    const res = await client.query<categoryList, categoryListVariables>({
        query: categoryListQuery,
        variables: { id: query.id },
    });

    return {
        props: {
            category: res.data.categoryList,
        },
    };
};

export const config = {
    unstable_runtimeJS: false,
};
