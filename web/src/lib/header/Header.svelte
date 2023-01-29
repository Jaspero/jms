<script lang="ts">
	export let links: Array<{label: string; link: string}> = [];
</script>

<header>
	<nav>
		<ul>
			{#each links as link}
				<li>
					<a href={link.link}>{link.label}</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>