import { Container, Grid, SimpleGrid, Skeleton } from "@mantine/core";
import { GetPoetListResponse } from "../../api/responses/GetPoetList.response";
import { useQuery } from "@tanstack/react-query";

const PRIMARY_COL_HEIGHT = "300px";

export function PoetChips() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const { data, isLoading, isPending } = useQuery<GetPoetListResponse>({
    queryKey: ["poets-list"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL}/poets/list`).then((res) =>
        res.json()
      ),
  });

  return (
    <Container my="md">
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" animate={isLoading} />
        <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={isLoading}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={isLoading}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={isLoading}
            />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
}
